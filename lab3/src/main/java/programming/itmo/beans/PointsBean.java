package programming.itmo.beans;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import javax.faces.annotation.ManagedProperty;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import lombok.Getter;
import lombok.Setter;
import programming.itmo.model.PointDTO;
import programming.itmo.util.CheckAreaUtil;

@ManagedBean(name="PointsBean")
@SessionScoped
@Getter
@Setter
public class PointsBean {
    @ManagedProperty("{checkAreaUtil")
    private CheckAreaUtil checkAreaUtil;

    private Map<String, Boolean> x;
    private BigDecimal y;
    private BigDecimal r;
    private boolean inArea;

    public List<PointDTO> getAllPoints() {
        return checkAreaUtil.getPointRepository().getAllPoints();
    }
    public List<PointDTO> getReversedPoints() {
        return checkAreaUtil.getPointRepository().getAllPoints(); //todo
    }



}
